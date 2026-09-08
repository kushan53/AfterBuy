import { Purchase } from '../models/Purchase.js';

// @desc    Get all purchases for logged in user
// @route   GET /api/purchases
export const getPurchases = async (req, res) => {
  try {
    const { search, category, status, sort } = req.query;

    let query = { user: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { merchant: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'Oldest First') sortOption = { createdAt: 1 };
    if (sort === 'Price: High to Low') sortOption = { price: -1 };
    if (sort === 'Price: Low to High') sortOption = { price: 1 };

    const purchases = await Purchase.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single purchase by ID
// @route   GET /api/purchases/:id
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user.id });

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new purchase
// @route   POST /api/purchases
export const createPurchase = async (req, res) => {
  try {
    const purchaseData = {
      ...req.body,
      user: req.user.id,
    };

    const purchase = await Purchase.create(purchaseData);

    res.status(201).json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update purchase details
// @route   PUT /api/purchases/:id
export const updatePurchase = async (req, res) => {
  try {
    let purchase = await Purchase.findOne({ _id: req.params.id, user: req.user.id });

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete purchase
// @route   DELETE /api/purchases/:id
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user.id });

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    await purchase.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Purchase removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger Return Request
// @route   POST /api/purchases/:id/return
export const requestReturn = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user.id });

    if (!purchase) {
      return res.status(404).json({ success: false, message: 'Purchase not found' });
    }

    purchase.returnStatus = 'return_requested';
    purchase.isUrgentReturn = false;
    purchase.refund = {
      id: `ref-${Date.now()}`,
      amount: purchase.price,
      expectedDate: 'In 5-7 days',
      status: 'refund-pending',
      isOverdue: false,
      settled: false,
      reason: req.body.reason || 'Customer return requested',
    };

    await purchase.save();

    res.status(200).json({
      success: true,
      message: 'Return successfully requested',
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Settle / Confirm Refund
// @route   POST /api/purchases/:id/settle-refund
export const settleRefund = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user.id });

    if (!purchase || !purchase.refund) {
      return res.status(404).json({ success: false, message: 'Refund record not found' });
    }

    purchase.refund.status = 'refund-received';
    purchase.refund.settled = true;
    purchase.refund.isOverdue = false;
    purchase.refund.settledAt = new Date();

    await purchase.save();

    res.status(200).json({
      success: true,
      message: 'Refund confirmed and deposited',
      data: purchase,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
