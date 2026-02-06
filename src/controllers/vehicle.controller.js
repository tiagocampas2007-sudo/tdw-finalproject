import Vehicle from "../models/Vehicle.js";
import Model from "../models/Model.js";  // ✅ AJOUTÉ pour démo
import Brand from "../models/Brand.js";  // ✅ AJOUTÉ pour démo

// ✅ NOUVEAU - Pour le frontend AppointmentsPage
export async function getMyVehicles(req, res) {
  try {
    console.log("🔥 getMyVehicles appelé");
    
    // Si utilisateur connecté → SES véhicules
    if (req.user?.id) {
      const userVehicles = await Vehicle.find({ clientId: req.user.id })
        .populate("brandId", "name image slug")
        .populate("modelId", "name slug")
        .lean();
      
      if (userVehicles.length > 0) {
        console.log(`✅ ${userVehicles.length} véhicules user trouvés`);
        return res.json(userVehicles);
      }
    }

    // ✅ SINON → DÉMO avec TOUS les modèles (20 voitures)
    console.log("📦 Envoi 20 modèles démo");
    const allModels = await Model.find({})
      .populate("brandId", "name image")
      .lean();

    const demoVehicles = allModels.map((model, index) => ({
      id: model.id,
      brand: model.brandId.name,
      model: model.name,
      brandImage: model.brandId.image,
      plate: `XX-${(index + 1).toString().padStart(2, '0')}-XX`,
      year: 2024,
      fuelType: "Gasolina",
      gearbox: index % 2 === 0 ? "Manual" : "Automático",
      cc: 1200 + (index * 50),
      color: ["Cinza", "Preto", "Branco", "Azul", "Vermelho"][index % 5]
    }));

    res.json(demoVehicles);
  } catch (error) {
    console.error("🚨 getMyVehicles ERROR:", error);
    res.status(500).json({ message: "Erro ao buscar veículos" });
  }
}

// Tes fonctions existantes (PARFAITES)
export async function createVehicle(req, res) {
  try {
    const { id, plate, year, fuelType, cc, color, brandId, modelId, clientId } = req.body;

    if (!clientId) return res.status(400).json({ message: "É necessário informar o cliente" });

    const newVehicle = await Vehicle.create({
      id,
      plate,
      year,
      fuelType,
      cc,
      color,
      brandId,
      modelId,
      clientId,
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar veículo", error: error.message });
  }
}

export async function getVehiclesByClient(req, res) {
  try {
    const { clientId } = req.params;

    const vehicles = await Vehicle.find({ clientId })
      .populate("brandId", "name image slug")
      .populate("modelId", "name slug")
      .populate("clientId");

    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar veículos do cliente", error: error.message });
  }
}

export async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const { plate, year, fuelType, cc, color, brandId, modelId } = req.body;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { plate, year, fuelType, cc, color, brandId, modelId },
      { new: true }
    );

    if (!updatedVehicle) return res.status(404).json({ message: "Veículo não encontrado" });

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar veículo", error: error.message });
  }
}

export async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) return res.status(404).json({ message: "Veículo não encontrado" });

    res.json({ message: "Veículo removido com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover veículo", error: error.message });
  }
}
