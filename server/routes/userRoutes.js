const express = require("express")
const router = express.Router()
const {
  registerUser,
  loginUser,
  addUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserRole,
  getUserById,
  giveObserverAccess,
  giveRootAccess,
} = require("../controllers/userController")

const { protect } = require("../middlewares/authMiddleware")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/all", getUsers)
router.post("/", addUser)
router.put("/:id", updateUser)
router.delete("/:id", deleteUser)
router.get("/role/:id", getUserRole)
router.get("/user/:id", getUserById)
router.put("/give-root-access/:id", giveRootAccess)
router.put("/give-observer-access/:id", giveObserverAccess)



module.exports = router
