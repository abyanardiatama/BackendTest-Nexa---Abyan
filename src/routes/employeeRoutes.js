const express = require("express");
const { addEmployee,getEmployees,updateEmployee,deactivateEmployee } = require("../controllers/employeeController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Menambah karyawan baru
router.post("/add", verifyToken, addEmployee);
router.get("/list", verifyToken, getEmployees);
router.put("/update/:nip", verifyToken, updateEmployee);
router.patch("/deactivate/:nip", verifyToken, deactivateEmployee);



module.exports = router;
