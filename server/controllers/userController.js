const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")
const jwtGenerator = require("../utils/jwtGenerator")

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length > 0) {
    return res.status(401).json("User already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );

  res.status(201).json({
    id: newUser.rows[0].user_id,
    name: newUser.rows[0].name,
    email: newUser.rows[0].email,
    message: "User created successfully",
    token: jwtGenerator(newUser.rows[0].user_id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
    return res.status(401).json("Invalid credentials");
  }

  res.status(200).json({
    id: user.rows[0].user_id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    token: jwtGenerator(user.rows[0].user_id),
  });
});

const addUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length > 0) {
    return res.status(401).json("User already exists!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );

  res.status(201).json({
    id: newUser.rows[0].user_id,
    name: newUser.rows[0].name,
    email: newUser.rows[0].email,
    message: "User created successfully",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { user_id, name, email } = req.body;

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);

  if (user.rows.length === 0) {
    return res.status(404).json("User not found");
  }

  const updatedUser = await pool.query(
    "UPDATE users SET name = $2, email = $3, updated_at = NOW() WHERE user_id = $1 RETURNING *",
    [user_id, name, email]
  );

  res.status(201).json({
    id: updatedUser.rows[0].user_id,
    name: updatedUser.rows[0].name,
    email: updatedUser.rows[0].email,
    message: "User updated successfully",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [req.params.id]);

  if (user.rows.length === 0) {
    return res.status(404).json("User not found");
  }

  await pool.query("DELETE FROM users WHERE user_id = $1", [req.params.id]);

  res.status(200).json("User deleted successfully");
});

const getUsers = asyncHandler(async (req, res) => {

  const users = await pool.query("SELECT user_id, email, name FROM users ORDER BY user_id ASC");
  res.json(
    users.rows.map((user) => {
      return {
        id: user.user_id,
        email: user.email,
        name: user.name,
      };
    })
  );
});

const getUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

  if (user.rows.length === 0) {
    return res.status(404).json("User not found");
  }

  const userRoles = await pool.query("SELECT role_id FROM user_roles WHERE user_id = $1", [id]);

  if (userRoles.rows.length === 0) {
    return res.status(404).json("User role not found");
  }

  const rolePermissions = await pool.query("SELECT permission_id FROM role_permissions WHERE role_id = $1", [
    userRoles.rows[0].role_id,
  ]);

  const permissions = rolePermissions.rows.map((row) => row.permission_id);

  res.json({
    user_id: id,
    role_id: userRoles.rows[0].role_id,
    permissions,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

  if (user.rows.length === 0) {
    return res.status(404).json("User not found");
  }

  res.json(user.rows[0]);
});

const giveRootAccess = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

  if (user.rows.length === 0) {
    return res.status(404).json("User not found");
  }

  const role = await pool.query("SELECT role_id FROM roles WHERE role_id = 'ROOT'");

  if (role.rows.length === 0) {
    return res.status(404).json("Role not found");
  }

  const userRole = await pool.query("SELECT * FROM user_roles WHERE user_id = $1", [id]);

  if (userRole.rows.length === 0) {
    await pool.query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [id, role.rows[0].role_id]);
  } else {
    await pool.query("UPDATE user_roles SET role_id = $2 WHERE user_id = $1", [id, role.rows[0].role_id]);
  }

  res.status(200).json("Root access given successfully");
});

const giveObserverAccess = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);

  if (user.rows.length === 0) {
    return res.status(404).json("User not found");
  }

  const role = await pool.query("SELECT role_id FROM roles WHERE role_id = 'OBSERVER'");

  if (role.rows.length === 0) {
    return res.status(404).json("Role not found");
  }

  const userRole = await pool.query("SELECT * FROM user_roles WHERE user_id = $1", [id]);

  if (userRole.rows.length === 0) {
    await pool.query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)", [id, role.rows[0].role_id]);
  } else {
    await pool.query("UPDATE user_roles SET role_id = $2 WHERE user_id = $1", [id, role.rows[0].role_id]);
  }

  res.status(200).json("Observer access given successfully");
});


module.exports = {
  registerUser,
  loginUser,
  addUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserRole,
  getUserById,
  giveRootAccess,
  giveObserverAccess,
}
