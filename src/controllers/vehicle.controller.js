import Vehicle from "../models/Vehicle.js";

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
      .populate("brandId")
      .populate("modelId")
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
