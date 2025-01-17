"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: Joshua Wise (maintainer of better-sqlite3) suggests using multiple
// prepared statements rather than batch inserts and selects :shrugging-man:.
// We'll see if this becomes an issue.
class ClockStore {
    constructor(db) {
        this.db = db;
        this.preparedGet = this.db.prepare(`SELECT * FROM Clock WHERE documentId=?`);
        this.preparedInsert = this.db.prepare(`INSERT INTO Clock (documentId, actorId, seq) 
       VALUES (?, ?, ?) 
       ON CONFLICT (documentId, actorId) 
       DO UPDATE SET seq=excluded.seq WHERE excluded.seq > seq`);
        this.preparedDelete = this.db.prepare('DELETE FROM Clock WHERE documentId=?');
    }
    /**
     * TODO: handle missing clocks better. Currently returns an empty clock (i.e. an empty object)
     */
    get(documentId) {
        const clockRows = this.preparedGet.all(documentId);
        return rowsToClock(clockRows);
    }
    /**
     * Retrieve the clocks for all given documents. If we don't have a clock
     * for a document, the resulting ClockMap won't have an entry for that document id.
     */
    getMultiple(documentIds) {
        const transaction = this.db.transaction((docIds) => {
            return docIds.reduce((clockMap, docId) => {
                const clock = this.get(docId);
                if (clock)
                    clockMap[docId] = clock;
                return clockMap;
            }, {});
        });
        return transaction(documentIds);
    }
    /**
     * Update an existing clock with a new clock, merging the two.
     * If no clock exists in the data store, the new clock is stored as-is.
     */
    update(documentId, clock) {
        const transaction = this.db.transaction((clockEntries) => {
            clockEntries.forEach(([feedId, seq]) => {
                this.preparedInsert.run(documentId, feedId, seq);
            });
            return this.get(documentId);
        });
        const updatedClock = transaction(Object.entries(clock));
        return [documentId, updatedClock];
    }
    /**
     * Hard set of a clock. Will clear any clock values that exist for the given document id
     * and set explicitly the passed in clock.
     */
    set(documentId, clock) {
        const transaction = this.db.transaction((documentId, clock) => {
            this.preparedDelete.run(documentId);
            return this.update(documentId, clock);
        });
        return transaction(documentId, clock);
    }
}
exports.default = ClockStore;
function rowsToClock(rows) {
    return rows.reduce((clock, row) => {
        clock[row.actorId] = row.seq;
        return clock;
    }, {});
}
//# sourceMappingURL=ClockStore.js.map