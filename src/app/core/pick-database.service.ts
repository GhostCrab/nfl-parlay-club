import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ParlayPick } from '../features/picks/interfaces/parlay-pick.interface';

@Injectable({
  providedIn: 'root'
})
export class PickDatabaseService {
  private pickCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    try {
      this.pickCollection = collection(firestore, 'picks');
    } catch(e) {
      console.log(firestore);
      console.error(e);
    }
  }

  getAll() {
    return collectionData(this.pickCollection, {
      idField: 'id',
    }) as Observable<ParlayPick[]>;
  }

  get(id: number) {
    const pickDocumentReference = doc(this.firestore, `picks/${id}`);
    return docData(pickDocumentReference, { idField: 'id' });
  }

  create(pick: ParlayPick) {
    return addDoc(this.pickCollection, pick);
  }

  update(pick: ParlayPick) {
    const pickDocumentReference = doc(
      this.firestore,
      `picks/${pick.userID}`
    );
    return updateDoc(pickDocumentReference, { ...pick });
  }

  delete(id: number) {
    const pickDocumentReference = doc(this.firestore, `picks/${id}`);
    return deleteDoc(pickDocumentReference);
  }
}
