import { TestBed } from '@angular/core/testing';
import { SocketService } from '../socket/socket.service';
import { Tab, TabStore } from './tab.store';

describe('TabStore', () => {
  let service: TabStore;
  let socketService: SocketService;

  const tabs: Tab[] = [
    {
      id: 'tab-1',
      active: true,
      targetType: 'consumer',
      targetId: 'consumer-1'
    },
    {
      id: 'tab-2',
      active: false,
      targetType: 'consumer',
      targetId: 'consumer-2'
    },
    {
      id: 'tab-3',
      active: false,
      targetType: 'consumer',
      targetId: 'consumer-3'
    },
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SocketService,
          useValue: jasmine.createSpyObj('socketService', ['send'])
        }
      ]
    });
    service = TestBed.inject(TabStore);
    socketService = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectTab', () => {
    it('should set the given tab to active', () => {
      service.store.entities = tabs;

      expect(service.store.entities[0].active).toEqual(true)

      service.selectTab(tabs[1].id);

      expect(service.store.entities[1].active).toEqual(true)
    });
  });

  describe('removeTab', () => {
    it('should remove the tab from the list', () => {
      service.store.entities = tabs;

      service.removeTab(tabs[1].id);

      expect(service.store.entities).toEqual([tabs[0], tabs[2]]);
    });

    it('should send a stop message if that tab was a consumer', () => {
      service.store.entities = tabs;

      service.removeTab(tabs[0].id);
      expect(socketService.send).toHaveBeenCalledWith({
        Topic: 'message.stop',
        Data: {
          ConsumerId: tabs[0].targetId
        }
      });
    })

    it('should select the next tab if available', () => {
      service.store.entities = tabs;

      service.selectTab(tabs[1].id);
      service.removeTab(tabs[1].id);

      expect(service.store.entities).toEqual([
        {
          ...tabs[0],
          active: false,
        },
        {
          ...tabs[2],
          active: true,
        }
      ]);
    });

    it('should select the previous tab if there is no next tab', () => {
      service.store.entities = tabs;

      service.selectTab(tabs[2].id);
      service.removeTab(tabs[2].id);

      expect(service.store.entities).toEqual([
        {
          ...tabs[0],
          active: false,
        },
        {
          ...tabs[1],
          active: true,
        }
      ]);
    });

    it('should not crash on the last tab', () => {
      service.store.entities = [tabs[0]];

      service.selectTab(tabs[0].id);
      service.removeTab(tabs[0].id);

      expect(service.store.entities).toEqual([]);
    });

    it('should not crash if given a bad tabid', () => {
      service.store.entities = tabs;

      service.removeTab('badid');

      expect(service.store.entities).toEqual(tabs);
    });
  });
});
