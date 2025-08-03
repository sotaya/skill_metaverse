import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  query,
  DocumentData,
  Query,
} from "firebase/firestore";
import { db } from "../../firebase";

interface Users {
  id: string;
  users: DocumentData;
}

const usersCollection = (data: string) => {
  const [documents, setDocuments] = useState<Users[]>([]);
  const collectionRef: Query<DocumentData> = query(collection(db, data));
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const usersResults: Users[] = [];
      querySnapshot.docs.forEach((doc) =>
        usersResults.push({
          id: doc.id,
          users: doc.data(),
        })
      );
      setDocuments(usersResults);
    });
    return () => unsubscribe();
  }, [data]);
  return { documents };
};

export default usersCollection;
