import React, { useState, useEffect } from "react";
import { onSnapshot, collection, query } from "firebase/firestore";
import { useAppSelector } from "../../app/hooks";
import { db } from "../../firebase";

interface Participants {
  position: [];
  uid: String;
}

const roomsSubCollection = (
  collectionName: string,
  subCollectionName: string
) => {
  const roomId = useAppSelector((state) => state.room.roomId);
  const [subdocuments, setSubDocuments] = useState<Participants[]>([]);
  useEffect(() => {
    let collectionRef = collection(
      db,
      collectionName,
      String(roomId),
      subCollectionName
    );

    const collectionRefoderBy = query(collectionRef);

    onSnapshot(collectionRefoderBy, (snapshot) => {
      let results: Participants[] = [];
      snapshot.docs.forEach((doc) => {
        results.push({
          position: doc.data().position,
          uid: doc.data().uid,
        });
      });
      setSubDocuments(results);
    });
  }, [roomId]);
  return { subdocuments };
};

export default roomsSubCollection;
