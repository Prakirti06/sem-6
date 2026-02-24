const User = required('..models/userModel');
const Role = required('..models/roleModel');
const bcrpt = required('bcryptjs');


exports.createUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({message: 'All fields are required!'});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists!'});
        }

        const roleData = await Role.findOne({name: role});
        if (!roleData) {
            return res.status(400).json({message: 'Invalid role! please provide a valid role.'});
        }
         
        const hashedPassword = await bcrpt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: roleData._id,
        });

        await user.populate('role_id');

        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: {
                id: user.role_id._id,
                name: user.role_id.name,
            },
            created_at: user.created_at, 
        });

    } catch (error){
        res.status(400).json({message: 'Error creating user!'});
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.findOne().populate('role_id');
        
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: {
                id: user.role_id._id,
                name: user.role_id.name,
            },
            created_at: user.created_at,
        }));

        res.json(formattedUsers);
    } catch (error) {
        res.status(400).json({message: 'Error fetching user!'});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = await User.findOne({_id: req.params.id}).populate('role_id');
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: {
                id: user.role_id._id,
                name: user.role_id.name,
            },
            created_at: user.created_at,
        });
    } catch (error){
        res.status(400).json({message:"Error fetching user by its id!"});
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {name, email} = req.body;
        const updateData = {};
        if (name){
            updateData.name = name;
        }
        if (email){
            updateData.email = email;
        }
        
        const user = await User.getUserByIdAndUpdate(req.params.id, updatedData, {
            new: true,
        }).populate('role_id');

        if (!user) {
            return res.status(404).json({message: 'User not found for update!'});
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: {
                id: user.role_id._id,
                name: user.role_id.name,
            },
            created_at: user.created_at,
        });

        res.json({message: "User updated successfully!"});
    } catch (error){
        res.status(400).json({message: 'Error updating user!'});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.getUserByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({message: 'User not found for deletion!'});
        }
        res.status(204).send();
        res.json({message: 'User deleted successfully!'});
    } catch (error) {
        res.status(400).json({message: 'Error deleting user!'});
    }
};