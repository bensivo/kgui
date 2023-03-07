import { Injectable } from "@angular/core";
import { createStore, withProps } from "@ngneat/elf";
import { nanoid } from "nanoid";
import { NzTreeNode, NzTreeNodeOptions } from "ng-zorro-antd/tree";

interface NavFolder {
    type: 'folder';
    id: string;
    name: string;
    expanded: boolean;
    children: NavItem[];
}

interface NavNode {
    type: 'node';
    id: string;
    name: string;
}

export type NavItem = NavFolder | NavNode;

export interface NavState {
    expanded: boolean;
    navItems: NavItem[];
    nzTreeNodes: NzTreeNodeOptions[];
}

@Injectable({
    providedIn: 'root'
})
export class NavStore {
    store = createStore({ name: 'nav' }, withProps<NavState>({
        expanded: true,
        navItems: [
            {
                id: nanoid(),
                type: 'folder',
                name: 'deming',
                expanded: false,
                children: [
                    {
                        id: nanoid(),
                        type: 'node',
                        name: 'Rovr',
                    },
                    {
                        id: nanoid(),
                        type: 'node',
                        name: 'Observr',
                    },
                ]
            },
            {
                id: nanoid(),
                type: 'folder',
                expanded: false,
                name: 'Hovertouch',
                children: [
                    {
                        id: nanoid(),
                        type: 'node',
                        name: 'Touch wall',
                    },
                    {
                        id: nanoid(),
                        type: 'node',
                        name: 'Touch car',
                    },
                ]
            },
        ],
        nzTreeNodes: [
            {
                title: 'deming',
                key: nanoid(),
                children: [
                    {
                        title: 'rovr',
                        key: nanoid(),
                    },
                    {
                        title: 'observr',
                        key: nanoid(),
                    }
                ]
            },
            {
                title: 'hovertouch',
                key: nanoid(),
                children: [
                    {
                        title: 'touchwall',
                        isLeaf: true,
                        key: nanoid(),
                    },
                    {
                        title: 'touchcar',
                        isLeaf: true,
                        key: nanoid(),
                    },
                    {
                        title: 'react table',
                        isLeaf: true,
                        key: nanoid(),
                    }
                ]
            }
        ]
    }));

    insertRootNode(newNode: NzTreeNodeOptions) {
        this.setNodes([
            ...this.store.state.nzTreeNodes,
            newNode
        ])
    }

    insertNode(newNode: NzTreeNodeOptions, parent: NzTreeNodeOptions): void {
        const nodes = this._insertNode(newNode, parent, this.store.state.nzTreeNodes)
        this.setNodes(nodes);
    }
    _insertNode(newNode: NzTreeNodeOptions, parent: NzTreeNodeOptions, nodes: NzTreeNodeOptions[]): NzTreeNodeOptions[] {
        return nodes.map(node => {
            if (node.key === parent.key) {
                console.log('Adding node to parent', node)
                return {
                    ...node,
                    expanded: true,
                    children: [
                        ...node.children ?? [],
                        newNode,
                    ]
                }
            }

            return {
                ...node,
                children: node.children ? this._insertNode(newNode, parent, node.children) : undefined,
            }
        })
    }

    replaceNode(key: string, newNode: NzTreeNodeOptions): void {
        console.log('Replacing node', key, 'with node', newNode);
        const nodes = this._replaceNode(key, newNode, this.store.state.nzTreeNodes);
        this.setNodes(nodes);
    }
    _replaceNode(key: string, newNode: NzTreeNodeOptions, nodes: NzTreeNodeOptions[]): NzTreeNodeOptions[] {
        return nodes.map(node => {
            if (node.key === key) {
                return newNode;
            }

            return {
                ...node,
                children: node.children ? this._replaceNode(key, newNode, node.children) : undefined,
            }
        })
    }

    setNodes(nodes: NzTreeNodeOptions[]) {
        // NzTreeNode objects technically fill the NzTreeNodeOptions interface, but the tree breaks 
        // if you call this function with actual NzTreeNode objects. To protect against this, we convert all 
        // nodes to the correct type before setting.
        const nzTreeNodes = nodes.map((n) => this.coerceToNodeOptions(n))

        this.store.update(s => ({
            ...s,
            nzTreeNodes: nzTreeNodes
        }))
    }

   coerceToNodeOptions(n: NzTreeNode | NzTreeNodeOptions): NzTreeNodeOptions {
        return {
            title: n.title,
            key: n.key,
            expanded: n.level !== undefined ? n.isExpanded : (n as NzTreeNodeOptions).expanded,
            isLeaf: n.isLeaf,
            children: n.children?.map(child => this.coerceToNodeOptions(child)),
        }
    }


    // findNode(key: string, items?: NzTreeNodeOptions[]): NzTreeNodeOptions | undefined {
    //     let searchItems = items ? items : this.store.state.nzTreeNodes;

    //     // DFS implementation to find a node by ID
    //     for (const item of searchItems) {
    //         if (item.key === key) {
    //             return item;
    //         }

    //         if (!item.isLeaf) {
    //             const res = this.findNode(key, item.children);
    //             if (res) {
    //                 return res
    //             }
    //         }
    //     }

    //     return undefined;
    // }
}