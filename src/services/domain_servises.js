const CustomGraphQLError = require("../handlers/AppError");
const { Domain } = require("../models/domains");
module.exports.createDomain = async (args) => {
  try {
    const created = await Domain.create({ ...args.body });
    return created;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};

module.exports.getDomains = async (args) => {
  try {
    const allDomains = await Domain.find();
    return allDomains;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};
module.exports.updateDomain = async (args) => {
  try {
    const domainId = args.id;
    const updateDomain = await Domain.findByIdAndUpdate(
      domainId,
      { ...args.body },
      { new: true }
    );
    return updateDomain;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};
module.exports.deleteDomain = async (args) => {
  try {
    const domainId = args.id;
    const deleted = await Domain.findByIdAndDelete(domainId);
    return deleted;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};
module.exports.getDomain = async (args) => {
  try {
    const domainId = args.id;
    const domain = await Domain.findById(domainId);
    return domain;
  } catch (error) {
    throw new CustomGraphQLError(error.message, {
      extensions: { code: "403" },
    });
  }
};
