const { getAllSigners, getAllSignersByCity } = require('./get_lists_db');
const { getSignatureByUserId, hasUserSigned } = require('./get_sig_db');
const {
    getUserNameById,
    getUserByEmail,
    getFullProfileById,
} = require('./get_users_db');
const { addUser, addSignature, addProfileInfo } = require('./write_db');
const { updateUserProfile } = require('./update_db');
const { deleteSignature, deleteUser } = require('./delete_db');

module.exports = {
    addSignature,
    addUser,
    addProfileInfo,
    hasUserSigned,
    getUserNameById,
    getUserByEmail,
    getFullProfileById,
    getSignatureByUserId,
    getAllSignersByCity,
    getAllSigners,
    updateUserProfile,
    deleteUser,
    deleteSignature,
};
