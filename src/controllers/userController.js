import userService from '../services/userService.js';

const userController = {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body, res);

      console.log("User created successfully:", req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating user",
        error: error.message
      });
    }
  }
  ,
    async getAllUsers(req, res) {
      try {
        const users = await userService.getAllUsers();
        
        res.status(200).json({
          success: true,
          message: "Users retrieved successfully",
          data: users
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Error fetching users",
          error: error.message
        });
      }
    }
};

export default userController;