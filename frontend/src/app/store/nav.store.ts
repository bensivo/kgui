import { Injectable } from "@angular/core";
import { createStore, select, withProps } from "@ngneat/elf";
import { Observable } from "rxjs";

export interface NavFolder {
    type: 'folder';
    id: string;
    name: string;
    expanded: boolean;
    children: NavNode[];
}

export interface NavLeaf {
    type: 'consumer' | 'producer';
    id: string;
    name: string;
}

export type NavNode = NavFolder | NavLeaf;

export interface NavState {
    expanded: boolean;
    nodes: NavNode[];
}

@Injectable({
    providedIn: 'root'
})
export class NavStore {
    store = createStore({ name: 'nav' }, withProps<NavState>({
        expanded: true,
        nodes: [],
    }));

    get navItems$(): Observable<NavNode[]> {
        return this.store.pipe(
            select(s => s.nodes)
        );
    }

    /**
     * Inserts a node, at the root level if no parentId is given, or under the parent.
     *
     * @param node 
     * @param parent 
     */
    insertNode(node: NavNode, parentId?: string) {
        const nodes = [...this.store.state.nodes];
        if (!parentId) {
            this.setNodes([
                ...nodes,
                node,
            ]);
            return;
        }

        if (!this.nodeExists(parentId)) {
            throw new Error(`Parent node ${parentId} not found`);
        }

        const newNodes = this._insertNode(node, parentId, this.store.state.nodes);
        this.setNodes(newNodes);
    }

    _insertNode(newNode: NavNode, parentId: string, nodes: NavNode[]): NavNode[] {
        return nodes.map(node => {
            if (node.id === parentId) {
                if (node.type !== 'folder') {
                    throw new Error(`Cannot add child to non-folder node ${parentId}`);
                }

                return {
                    ...node,
                    children: [
                        ...node.children ?? [],
                        newNode,
                    ]
                }
            }

            switch (node.type) {
                case 'folder':
                    return {
                        ...node,
                        children: this._insertNode(newNode, parentId, node.children)
                    };
                case 'consumer':
                case 'producer':
                    return node;
            }


        })
    }

    updateNode(id: string, data: Partial<NavNode>) {
        if (!this.nodeExists(id)) {
            throw new Error(`Cannot update node. Node ${id} not found`);
        }

        const newNodes = this._updateNode(id, data, this.store.state.nodes);
        this.setNodes(newNodes);
    }
    _updateNode(id: string, data: Partial<NavNode>, nodes: NavNode[]): NavNode[] {
        return nodes.map(node => {
            if (node.id === id) {
                return {
                    ...node,
                    ...data as NavNode,
                }
            }

            switch (node.type) {
                case 'folder':
                    return {
                        ...node,
                        children: this._updateNode(id, data, (node as NavFolder).children)
                    };
                case 'consumer':
                case 'producer':
                    return node;
            }
        })
    }

    removeNode(id: string) {
        const newNodes = this._removeNode(id, this.store.state.nodes);
        this.setNodes(newNodes);
    }
    _removeNode(id: string, nodes: NavNode[]): NavNode[] {
        return nodes.map(node => {
            if (node.id === id) {
                return undefined;
            }

            switch (node.type) {
                case 'folder':
                    return {
                        ...node,
                        children: this._removeNode(id, (node as NavFolder).children)
                    };
                case 'consumer':
                case 'producer':
                    return node;
            }
        })
            .filter(n => !!n) as NavNode[]; // Compiler can't tell that this removes all undefined values. Thus, typecasting
    }

    private nodeExists(id: string): boolean {
        return this._nodeExists(id, this.store.state.nodes);
    }
    private _nodeExists(id: string, nodes: NavNode[]) {
        // Potential improvement - stop computing once you find the node that matches
        const res: boolean[] = nodes.map(node => {
            if (node.id === id) {
                return true;
            }

            switch (node.type) {
                case 'folder':
                    return this._nodeExists(id, node.children);
                case 'consumer':
                case 'producer':
                    return false;
            }
        });

        return res.includes(true);
    }

    setNodes(nodes: NavNode[]) {
        this.store.update(s => ({
            ...s,
            nodes: nodes,
        }))
    }
}