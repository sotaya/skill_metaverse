import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  DocumentData,
  Query,
} from "firebase/firestore";
import { db } from "../../firebase";

interface Rooms {
  id: string;
  rooms: DocumentData;
}

const roomsCollection = (data: string) => {
  const [documents, setDocuments] = useState<Rooms[]>([]);
  const collectionRef: Query<DocumentData> = query(collection(db, data));
  useEffect(() => {
    onSnapshot(collectionRef, (querySnapshot) => {
      const roomsResults: Rooms[] = [];
      querySnapshot.docs.forEach((doc) =>
        roomsResults.push({
          id: doc.id,
          rooms: doc.data(),
        })
      );
      setDocuments(roomsResults);
    });
  }, []);
  return { documents };
};

export default roomsCollection;
