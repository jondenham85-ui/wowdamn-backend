const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const MOCK_USERS = [
  { id:"usr_001", name:"Jon Denham", email:"jon@wowdamn.com", role:"owner", tier:"omega", verified:true, joinedAt:"2024-01-01T00:00:00Z", revenue:0 },
  { id:"usr_002", name:"MadMadison CEO", email:"ceo@wowdamn.com", role:"ceo", tier:"titan", verified:true, joinedAt:"2024-01-15T00:00:00Z", revenue:0 },
  { id:"usr_003", name:"Admin User", email:"admin@wowdamn.com", role:"admin", tier:"inferno", verified:true, joinedAt:"2024-02-01T00:00:00Z", revenue:0 },
  { id:"usr_004", name:"Alex Rivera", email:"alex@example.com", role:"member", tier:"blaze", verified:false, joinedAt:"2024-03-10T00:00:00Z", revenue:24500 },
  { id:"usr_005", name:"Jordan Kim", email:"jordan@example.com", role:"member", tier:"inferno", verified:true, joinedAt:"2024-03-22T00:00:00Z", revenue:87300 },
  { id:"usr_006", name:"Sam Torres", email:"sam@example.com", role:"member", tier:"spark", verified:false, joinedAt:"2024-04-05T00:00:00Z", revenue:3200 },
  { id:"usr_007", name:"Casey Morgan", email:"casey@example.com", role:"member", tier:"blaze", verified:true, joinedAt:"2024-04-18T00:00:00Z", revenue:31400 },
  { id:"usr_008", name:"Riley Chen", email:"riley@example.com", role:"member", tier:"titan", verified:true, joinedAt:"2024-05-02T00:00:00Z", revenue:215000 },
  { id:"usr_009", name:"Morgan Walsh", email:"morgan@example.com", role:"member", tier:"spark", verified:false, joinedAt:"2024-05-14T00:00:00Z", revenue:1800 },
  { id:"usr_010", name:"Dana Park", email:"dana@example.com", role:"member", tier:"blaze", verified:true, joinedAt:"2024-06-01T00:00:00Z", revenue:42800 },
  { id:"usr_011", name:"Quinn Avery", email:"quinn@example.com", role:"member", tier:"omega", verified:true, joinedAt:"2024-06-10T00:00:00Z", revenue:580000 },
  { id:"usr_012", name:"Drew Silva", email:"drew@example.com", role:"member", tier:"inferno", verified:true, joinedAt:"2024-07-01T00:00:00Z", revenue:93200 },
];

router.get("/", auth, (req, res) => {
  const { role, tier, verified, search } = req.query;
  let users = MOCK_USERS.filter(u => {
    if (role && u.role !== role) return false;
    if (tier && u.tier !== tier) return false;
    if (verified !== undefined && u.verified !== (verified === "true")) return false;
    if (search) { const s = search.toLowerCase(); if (!u.name.toLowerCase().includes(s) && !u.email.toLowerCase().includes(s)) return false; }
    return true;
  });
  res.json(users);
});

module.exports = router;
