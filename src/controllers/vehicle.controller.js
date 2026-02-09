import Vehicle from "../models/Vehicle.js";
import Model from "../models/Model.js";
import Brand from "../models/Brand.js";

// ✅ getMyVehicles (PERFEITO - só carros reais)
export async function getMyVehicles(req, res) {
  try {
    console.log("🔥 getMyVehicles - APENAS BD");
    
    // Se utilizador conectado → OS SEUS veículos
    if (req.user?.id) {
      const userVehicles = await Vehicle.find({ clientId: req.user.id })
        .populate("brandId", "name image slug")
        .populate("modelId", "name slug brandId")
        .populate("clientId", "name email")
        .lean();
        
      console.log(`✅ ${userVehicles.length} veículos user ${req.user.id} encontrados`);
      
      if (userVehicles.length > 0) {
        return res.json(userVehicles);
      }
    }

    // SENÃO → TODOS os carros na BD
    console.log("📦 Procurar TODOS os carros BD...");
    const allVehicles = await Vehicle.find({})
      .populate("brandId", "name image slug")
      .populate("modelId", "name slug brandId")
      .populate("clientId", "name email")
      .lean();

    console.log(`✅ ${allVehicles.length} CARROS REAIS encontrados`);
    res.json(allVehicles);
  } catch (error) {
    console.error("🚨 getMyVehicles ERROR:", error);
    res.status(500).json({ message: "Erro ao buscar veículos" });
  }
}

// ✅ createVehicle (CORRIGIDO - ID AUTOMÁTICO + VALIDAÇÕES)
export async function createVehicle(req, res) {
  try {
    let { plate, year, fuelType, cc, color, brandId, modelId } = req.body;
    
    console.log("📥 Recebido BRUTO:", req.body);

    // ✅ GERA ID SEQUENCIAL AUTOMÁTICO
    const lastVehicle = await Vehicle.findOne().sort({ id: -1 }).lean();
    const id = lastVehicle ? lastVehicle.id + 1 : 1;
    
    console.log(`🔢 Próximo ID automático: ${id}`);

    // ✅ VALIDAÇÃO E CONVERSÃO SEGURA
    year = Number(year);
    if (isNaN(year) || year < 1900 || year > 2030) {
      return res.status(400).json({ error: "Ano inválido (1900-2030)" });
    }

    cc = Number(cc);
    if (isNaN(cc) || cc <= 0) {
      return res.status(400).json({ error: "CC inválido (deve ser > 0)" });
    }

    if (!plate || plate.trim().length < 3) {
      return res.status(400).json({ error: "Placa inválida (mín 3 caracteres)" });
    }

    console.log("✅ Dados validados:", { id, plate, year, cc });

    // ✅ CONVERTE brandId numérico → ObjectId
    if (brandId && String(brandId).length !== 24) {
      const brand = await Brand.findOne({ id: Number(brandId) });
      if (!brand) return res.status(400).json({ error: `Marca ${brandId} não encontrada` });
      brandId = brand._id;
    }

    // ✅ CONVERTE modelId numérico → ObjectId
    if (modelId && String(modelId).length !== 24) {
      const model = await Model.findOne({ id: Number(modelId) });
      if (!model) return res.status(400).json({ error: `Modelo ${modelId} não encontrado` });
      modelId = model._id;
    }

    // ✅ ClientId (fallback teste)
    const clientId = req.user?.id || req.body.clientId || "66f333333333333333333333";

    console.log("🔄 Final:", { 
      id, 
      brandId: brandId?.toString(), 
      modelId: modelId?.toString(), 
      clientId 
    });

    const newVehicle = await Vehicle.create({
      id,
      plate: plate.trim(),
      year,
      fuelType,
      cc,
      color,
      brandId,
      modelId,
      clientId
    });

    console.log(`✅ Carro ID ${id} criado PERFEITAMENTE!`);
    res.status(201).json(newVehicle);

  } catch (error) {
    console.error("🚨 createVehicle ERROR:", error.message);
    res.status(500).json({ 
      message: "Erro ao criar veículo",
      error: error.message,
      received: req.body  // DEBUG
    });
  }
}

// ✅ getVehiclesByClient (CORRIGIDO - .lean())
export async function getVehiclesByClient(req, res) {
  try {
    const { clientId } = req.params;

    const vehicles = await Vehicle.find({ clientId })
      .populate("brandId", "name image slug")
      .populate("modelId", "name slug brandId")
      .populate("clientId", "name email")
      .lean();  // ✅ ADICIONADO

    console.log(`✅ ${vehicles.length} carros cliente ${clientId}`);
    res.json(vehicles);
  } catch (error) {
    console.error("❌ getVehiclesByClient:", error);
    res.status(500).json({ message: "Erro ao listar veículos do cliente", error: error.message });
  }
}

// ✅ updateVehicle (CORRIGIDO - validação + populate)
export async function updateVehicle(req, res) {
  try {
    const { id } = req.params;
    const { plate, year, fuelType, cc, color, brandId, modelId } = req.body;

    console.log(`🔧 Atualizar veículo ID: ${id}`);

    // ✅ VALIDAÇÃO ID
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return res.status(400).json({ error: "ID inválido (deve ser número > 0)" });
    }

    // ✅ CONVERTE brandId/modelId se necessário
    let finalBrandId = brandId;
    let finalModelId = modelId;
    
    if (brandId && String(brandId).length !== 24) {
      const brand = await Brand.findOne({ id: Number(brandId) });
      if (!brand) return res.status(400).json({ error: `Marca ${brandId} não encontrada` });
      finalBrandId = brand._id;
    }

    if (modelId && String(modelId).length !== 24) {
      const model = await Model.findOne({ id: Number(modelId) });
      if (!model) return res.status(400).json({ error: `Modelo ${modelId} não encontrado` });
      finalModelId = model._id;
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { id: numId },
      { 
        plate: plate?.trim(), 
        year: Number(year), 
        fuelType, 
        cc: Number(cc), 
        color, 
        brandId: finalBrandId, 
        modelId: finalModelId 
      },
      { new: true }
    )
    .populate("brandId", "name image slug")
    .populate("modelId", "name slug brandId");

    if (!updatedVehicle) {
      console.log(`❌ Veículo ID ${id} não encontrado`);
      return res.status(404).json({ message: "Veículo não encontrado" });
    }

    console.log(`✅ Veículo ${id} atualizado`);
    res.json(updatedVehicle);
  } catch (error) {
    console.error("❌ updateVehicle:", error);
    res.status(500).json({ message: "Erro ao atualizar veículo", error: error.message });
  }
}

// ✅ deleteVehicle (CORRIGIDO - validação ID)
export async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Eliminar veículo ID: ${id}`);

    // ✅ VALIDAÇÃO ID
    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      console.log(`❌ ID inválido: ${id}`);
      return res.status(400).json({ error: "ID inválido (deve ser número > 0)" });
    }

    const deletedVehicle = await Vehicle.findOneAndDelete({ 
      id: numId
    });

    if (!deletedVehicle) {
      console.log(`❌ Veículo ID ${id} não existe na BD`);
      return res.status(404).json({ message: "Veículo não encontrado" });
    }

    console.log(`✅ Veículo ${id} eliminado`);
    res.json({ message: "Veículo removido com sucesso!" });
  } catch (error) {
    console.error("❌ deleteVehicle:", error);
    res.status(500).json({ message: "Erro ao remover veículo", error: error.message });
  }
}
