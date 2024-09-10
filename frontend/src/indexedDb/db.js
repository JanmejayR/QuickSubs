import { openDB } from 'idb';

const dbName = 'userVideoUploads'
const storeName = 'videos'

export async function initDB(){
    const db = await openDB(dbName, 1, {
        upgrade(db) {
            if(!db.objectStoreNames.contains(storeName)){
                db.createObjectStore(storeName, {keyPath: 'id'});
            }
        }
    })
    return db;
}

export async function storeVideos(video, userId){
    const db = await initDB();
    await db.put(storeName, { id:userId , video});
}

export async function getVideo(userId){
    const db = await initDB();
    return await db.get(storeName, userId);
}

export async function storeSrt(userId, srtContent) {
    const db = await initDB();
    
    // Retrieve existing user data
    const userData = await db.get(storeName, userId);
    
    if (userData) {
        // Update user data with new SRT content
        userData.srtContent = srtContent;
        await db.put(storeName, userData);
        console.log(" subtitles added to db as a string")
    } else {
        console.log(`User with ID ${userId} not found in the database.`);
    }
}