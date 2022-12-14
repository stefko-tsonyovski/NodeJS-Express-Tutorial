const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs });
};

const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, createdBy: req.user.userId });
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;
  const { company, position } = req.body;

  // if (!company || !position) {
  //   throw new BadRequestError("Company or Position fields cannot be empty");
  // }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, createJob, getJob, updateJob, deleteJob };
