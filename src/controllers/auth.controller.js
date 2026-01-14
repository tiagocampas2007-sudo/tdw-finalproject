import bcrypt from "bcrypt";
import User from "../models/User.js";
import UserRole from "../models/UserRole.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "A palavra-passe deve ter pelo menos 8 caracteres." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Já existe uma conta com este email." });
    }

    const clientRole = await UserRole.findOne({ role: "CLIENT" });
    if (!clientRole) {
      return res.status(500).json({ message: 'Role "CLIENT" não existe em user_roles.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: clientRole._id
    });

    return res.status(201).json({
      message: "Conta criada com sucesso.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: clientRole.role,
        roleId: clientRole.id
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
