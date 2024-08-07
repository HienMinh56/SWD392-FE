/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const userApi = require('../api/user.api');
const campusApi = require('../api/campus.api');

async function getUsers(req, res) {
    const { userId, Name, email, phone, status, campusName } = req.query;
    
    const filters = {};
    if (userId !== undefined) filters.userId = userId;
    if (Name !== undefined) filters.Name = Name;
    if (email !== undefined) filters.email = email;
    if (phone !== undefined) filters.phone = phone;
    if (status !== undefined) filters.status = status;
    if (campusName !== undefined) filters.campusName = campusName;

    try {
        const userData = await userApi.getUsers(userId, filters);
        const campusData = await campusApi.getCampus();

        if (userData.error || campusData.error) {
            res.render('./pages/user', { text: 'User', users: [], adminsAndShippers: [], customers: [], campuses: [] });
        } else {
            res.render('./pages/user', { text: 'User', ...userData, campuses: campusData.campuses });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('./pages/user', { text: 'User', users: [], adminsAndShippers: [], customers: [], campuses: [] });
    }
}

async function getUserDetail(req, res) {
    const { userId } = req.params;
    const { status, campusName } = req.query;

    const filters = {};
    if (status !== undefined) filters.status = status;
    if (campusName !== undefined) filters.campusName = campusName;
  
    try {
        const userData = await userApi.getUsers(userId, filters);
        const campusData = await campusApi.getCampus();
  
        if (userData.error || campusData.error) {
            res.render('./pages/user_detail', { text: 'Profile', user: {}, campus: [] });
        } else {
            console.log(userData.users[0]);
            res.render('./pages/user_detail', { text: 'Profile', user: userData.users[0], campuses: campusData.campuses });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.render('./pages/user_detail', { text: 'Profile', user: {}, campus: [] });
    }
}

async function addUser(req, res) {
    const userData = req.body;

    try {
        const result = await userApi.addUser(userData);
        res.json(result);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'An error occurred while adding the user' });
    }
}

async function updateUser(req, res) {
    const userId = req.query.userId;
    const userData = req.body;

    try {
        const result = await userApi.updateUser(userId, userData);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
}

async function updateUserDetail(req, res) {
    const userId = req.query.userId;
    const userData = req.body;

    try {
        const result = await userApi.updateUserDetail(userId, userData);
        res.json(result);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'An error occurred while updating the user' });
    }
}

async function deleteUser(req, res) {
    const { userId } = req.body;

    try {
        const result = await userApi.deleteUser(userId);
        res.json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
}

module.exports = { getUsers, getUserDetail, addUser, updateUser, updateUserDetail, deleteUser };