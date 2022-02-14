const express = require("express");

const { validateId } = require("../middlewares/objectIdValidation");
const { validateToken } = require("../middlewares/userValidation");
const { validateMember } = require("../middlewares/memberValidation");
const {
  validateInvitation,
  validateInviteToken,
} = require("../middlewares/invitationValidation");

const mapController = require("../controllers/mapController");

const router = express.Router();

router.get("/:id/photos", validateId, mapController.getMapPhotos);

router.get(
  "/:id/points",
  validateId,
  validateToken,
  validateMember,
  mapController.getMapPoints
);
router.post("/new", mapController.createNewMap);
router.get("/:id/members", validateId, mapController.getMembers);

router.put(
  "/:id/invitation",
  validateId,
  validateInviteToken,
  mapController.inviteNewMember
);
router.put(
  "/:id/invitation/:token",
  validateId,
  validateInvitation,
  mapController.addInvitedUser
);

module.exports = router;
