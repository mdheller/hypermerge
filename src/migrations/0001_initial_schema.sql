CREATE TABLE IF NOT EXISTS Clocks (
    repoId TEXT NOT NULL,
    documentId TEXT NOT NULL,
    actorId TEXT NOT NULL,
    seq INTEGER NOT NULL,
    PRIMARY KEY (repoId, documentId, actorId)
) WITHOUT ROWID;

CREATE TABLE IF NOT EXISTS Keys (
    name TEXT PRIMARY KEY,
    publicKey BLOB NOT NULL,
    secretKey BLOB
) WITHOUT ROWID;