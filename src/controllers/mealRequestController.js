import mealRequestService from "../services/mealRequestService.js";

const createRequest = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can create meal requests",
      });
    }
    const userId = req.user.id;
    const userCity = req.user.city;
    const mealRequest = await mealRequestService.createMealRequest(
      req.body,
      req.file,
      userId,
      userCity
    );
    res.status(201).json({
      success: true,
      mealRequest,
      message: "Meal request submitted successfully",
    });
  } catch (err) {
    console.error("Create Meal Request Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAvailableRequests = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can view available meal requests",
      });
    }
    const city = req.user.city;
    const sellerId = req.user.id;
    const requests = await mealRequestService.getAvailableMealRequests(city, sellerId);
    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("Get Available Requests Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their meal requests",
      });
    }
    const userId = req.user.id;
    const requests = await mealRequestService.getStudentMealRequests(userId);
    res.status(200).json({ success: true, requests });
  } catch (err) {
    console.error("Get My Requests Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const acceptRequest = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can accept meal requests",
      });
    }
    const { id } = req.params;
    const sellerId = req.user.id;
    const request = await mealRequestService.acceptMealRequest(id, sellerId);
    res.status(200).json({
      success: true,
      request,
      message: "You have accepted this meal request",
    });
  } catch (err) {
    console.error("Accept Request Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const fulfillRequest = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can fulfill meal requests",
      });
    }
    const { id } = req.params;
    const sellerId = req.user.id;
    const request = await mealRequestService.fulfillMealRequest(id, sellerId);
    res.status(200).json({
      success: true,
      request,
      message: "Meal request fulfilled successfully",
    });
  } catch (err) {
    console.error("Fulfill Request Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateRequest = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can update meal requests",
      });
    }
    const { id } = req.params;
    const userId = req.user.id;
    const mealRequest = await mealRequestService.updateMealRequest(
      id,
      userId,
      req.body,
      req.file
    );
    res.status(200).json({
      success: true,
      mealRequest,
      message: "Meal request updated successfully",
    });
  } catch (err) {
    console.error("Update Meal Request Error:", err);
    const status = err.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can delete meal requests",
      });
    }
    const { id } = req.params;
    const userId = req.user.id;
    await mealRequestService.deleteMealRequest(id, userId);
    res.status(200).json({
      success: true,
      message: "Meal request deleted successfully",
    });
  } catch (err) {
    console.error("Delete Meal Request Error:", err);
    const status = err.message.includes("not found") ? 404 : 400;
    res.status(status).json({ success: false, message: err.message });
  }
};

export default {
  createRequest,
  getAvailableRequests,
  getMyRequests,
  acceptRequest,
  fulfillRequest,
  updateRequest,
  deleteRequest,
};
