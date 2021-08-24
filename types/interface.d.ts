export interface Document {
    original: string;
    lines: string[];
    dataHunks: DocHunk[];
    hunksByName: Map<string, DocHunk>;
}
export interface Hunk {
    name: string;
    blockTag: string;
    body: string;
}
export interface DocHunk extends Hunk {
    lineStart: number;
    lineEnd: number;
}
export interface DirEnt {
    name: string;
    hunk: Hunk | null;
    children: Map<string, DirEnt> | null;
    childrenList: DirEnt[] | null;
}
//# sourceMappingURL=interface.d.ts.map