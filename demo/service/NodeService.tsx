import type { TreeNode } from "primereact/treenode";

export const NodeService = {
    getTreeNodes(): Promise<TreeNode[]> {
        return fetch("/demo/data/treenodes.json", { headers: { "Cache-Control": "no-cache" } })
            .then((res) => res.json())
            .then((d) => d.root as TreeNode[]);
    },

    getTreeTableNodes(): Promise<TreeNode[]> {
        return fetch("/demo/data/treetablenodes.json", { headers: { "Cache-Control": "no-cache" } })
            .then((res) => res.json())
            .then((d) => d.root as TreeNode[]);
    },
};