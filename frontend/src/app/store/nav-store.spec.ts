import { TestBed } from "@angular/core/testing";
import { NavFolder, NavNode, NavLeaf, NavStore } from "./nav.store";

describe('nav-store', () => {
    let service: NavStore;

    const navFolder: NavFolder = {
        type: 'folder',
        id: 'navFolder',
        name: 'folder-1',
        expanded: false,
        children: []
    };
    const navNode: NavLeaf = {
        type: 'leaf',
        id: 'navNode',
        name: 'node-1',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                NavStore
            ]
        });
        service = TestBed.inject(NavStore);
    });

    describe('setNodes', () => {
        it('should emit new nodes', (done) => {
            service.navItems$.subscribe((navItems) => {
                if (navItems.length > 0) {
                    expect(navItems[0]).toEqual(navNode)
                    done();
                }
            });

            service.setNodes([navNode]);
        });
    });

    describe('insertNodes', () => {
        beforeEach((done) => {
            service.navItems$.subscribe(() => done());
            service.setNodes([navFolder]);
        });

        it('should add to root if no parent given', (done) => {
            service.navItems$.subscribe((navItems) => {
                if (navItems.length === 2) {
                    expect(navItems).toEqual([navFolder, navNode]);
                    done();
                }
            });

            service.insertNode(navNode)
        });

        it('should add node to parent folder', (done) => {
            service.navItems$.subscribe((navItems) => {
                if ((navItems[0] as NavFolder).children[0] === navNode) {
                    expect(navItems).toEqual([
                        {
                            ...navFolder,
                            children: [
                                navNode
                            ]
                        }
                    ]);
                    done();
                }
            });

            service.insertNode(navNode, navFolder.id);
        });

        it('should throw if parent is not a folder', () => {
            expect(() => {
                service.setNodes([navNode]);
                service.insertNode(navNode, navNode.id);
            }).toThrow()
        });

        it('should throw if parent is not found', () => {
            expect(() => {
                service.setNodes([navNode]);
                service.insertNode(navNode, 'asdf');
            }).toThrow()
        });
    });

    describe('updateNode', () => {
        it('should update node', (done) => {
            service.navItems$.subscribe((navItems) => {
                if (navItems[0]?.name === 'asdf') {
                    expect(navItems).toEqual([{
                        ...navNode,
                        name: 'asdf',
                    }]);
                    done();
                }
            });

            service.insertNode(navNode)
            service.updateNode(navNode.id, {
                name: 'asdf'
            });
        });

        it('should throw if node is not found', () => {
            expect(() => {
                service.setNodes([navNode]);
                service.updateNode('asdf', {});
            }).toThrow();
        });
    });

    describe('removeNode', () => {
        it('should remove node', (done) => {
            service.navItems$.subscribe((navItems) => {
                console.log('sub', navItems)
                if ((navItems[0] as NavFolder)?.children?.length === 0) {
                    expect(navItems).toEqual([
                        {
                            ...navFolder,
                            children: [],
                        }
                    ])
                    done();
                }
            });

            service.insertNode({
                ...navFolder,
                children: [
                    navNode
                ]
            });
            service.removeNode(navNode.id);
        });
    });
});