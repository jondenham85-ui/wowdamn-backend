const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

let mockVerifications = [
  { id: "ver_001", userId: "usr_001", userName: "Alex Rivera", userEmail: "alex@example.com", type: "identity", status: "pending", submittedAt: new Date(Date.now() - 2*3600000).toISOString(), documents: ["id_front.jpg","id_back.jpg"], notes: null, reviewedBy: null, reviewedAt: null },
  { id: "ver_002", userId: "usr_002", userName: "Jordan Kim", userEmail: "jordan@example.com", type: "business", status: "reviewing", submittedAt: new Date(Date.now() - 5*3600000).toISOString(), documents: ["business_license.pdf"], notes: null, reviewedBy: null, reviewedAt: null },
  { id: "ver_003", userId: "usr_003", userName: "Sam Torres", userEmail: "sam@example.com", type: "tier_upgrade", status: "pending", submittedAt: new Date(Date.now() - 3600000).toISOString(), documents: ["revenue_proof.pdf"], notes: null, reviewedBy: null, reviewedAt: null },
  { id: "ver_004", userId: "usr_004", userName: "Casey Morgan", userEmail: "casey@example.com", type: "identity", status: "pending", submittedAt: new Date(Date.now() - 30*60000).toISOString(), documents: ["passport.jpg"], notes: null, reviewedBy: null, reviewedAt: null },
];

router.get("/pending", auth, (req, res) => {
  res.json(mockVerifications.filter(v => ["pending","reviewing"].includes(v.status)));
});

router.post("/:id/approve", auth, (req, res) => {
  const idx = mockVerifications.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  mockVerifications[idx] = { ...mockVerifications[idx], status: "approved", notes: req.body.notes||null, reviewedBy: req.user.id, reviewedAt: new Date().toISOString() };
  res.json(mockVerifications[idx]);
});

router.post("/:id/reject", auth, (req, res) => {
  const idx = mockVerifications.findIndex(v => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  mockVerifications[idx] = { ...mockVerifications[idx], status: "rejected", notes: req.body.notes||null, reviewedBy: req.user.id, reviewedAt: new Date().toISOString() };
  res.json(mockVerifications[idx]);
});

module.exports = router;
