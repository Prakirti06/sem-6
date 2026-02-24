const Role = require("../models/Role");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: "Error while creating the role" });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(400).json({ message: "Error fetching all the roles!" });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: "Error fetching role by its id!" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, { name }, { new: true });

    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(400).json({ message: "Error updating the role!" });
  }
};


exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json({ message: "Role deleted Successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Error Deleting the role!" });
  }
};
  