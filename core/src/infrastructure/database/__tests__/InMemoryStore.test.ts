import { InMemoryStore } from '../../../infrastructure/database/InMemoryStore';

interface TestEntity {
  id: string;
  name: string;
  value: number;
}

describe('InMemoryStore', () => {
  let store: InMemoryStore<TestEntity>;

  beforeEach(() => {
    store = new InMemoryStore<TestEntity>();
  });

  describe('set and get', () => {
    it('should store and retrieve an item', () => {
      const entity: TestEntity = { id: '1', name: 'Test', value: 100 };
      store.set('1', entity);

      const result = store.get('1');

      expect(result).toEqual(entity);
    });

    it('should return undefined for non-existent item', () => {
      const result = store.get('non-existent');

      expect(result).toBeUndefined();
    });

    it('should overwrite existing item with same id', () => {
      const entity1: TestEntity = { id: '1', name: 'Original', value: 100 };
      const entity2: TestEntity = { id: '1', name: 'Updated', value: 200 };

      store.set('1', entity1);
      store.set('1', entity2);

      const result = store.get('1');

      expect(result).toEqual(entity2);
      expect(result?.name).toBe('Updated');
    });
  });

  describe('getAll', () => {
    it('should return empty array when store is empty', () => {
      const result = store.getAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should return all items', () => {
      const entity1: TestEntity = { id: '1', name: 'First', value: 1 };
      const entity2: TestEntity = { id: '2', name: 'Second', value: 2 };
      const entity3: TestEntity = { id: '3', name: 'Third', value: 3 };

      store.set('1', entity1);
      store.set('2', entity2);
      store.set('3', entity3);

      const result = store.getAll();

      expect(result).toHaveLength(3);
      expect(result).toContainEqual(entity1);
      expect(result).toContainEqual(entity2);
      expect(result).toContainEqual(entity3);
    });
  });

  describe('delete', () => {
    it('should delete an existing item and return true', () => {
      const entity: TestEntity = { id: '1', name: 'Test', value: 100 };
      store.set('1', entity);

      const result = store.delete('1');

      expect(result).toBe(true);
      expect(store.get('1')).toBeUndefined();
    });

    it('should return false when deleting non-existent item', () => {
      const result = store.delete('non-existent');

      expect(result).toBe(false);
    });

    it('should only delete the specified item', () => {
      const entity1: TestEntity = { id: '1', name: 'First', value: 1 };
      const entity2: TestEntity = { id: '2', name: 'Second', value: 2 };

      store.set('1', entity1);
      store.set('2', entity2);

      store.delete('1');

      expect(store.get('1')).toBeUndefined();
      expect(store.get('2')).toEqual(entity2);
    });
  });

  describe('has', () => {
    it('should return true for existing item', () => {
      const entity: TestEntity = { id: '1', name: 'Test', value: 100 };
      store.set('1', entity);

      const result = store.has('1');

      expect(result).toBe(true);
    });

    it('should return false for non-existent item', () => {
      const result = store.has('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all items', () => {
      store.set('1', { id: '1', name: 'First', value: 1 });
      store.set('2', { id: '2', name: 'Second', value: 2 });

      store.clear();

      expect(store.getAll()).toEqual([]);
      expect(store.get('1')).toBeUndefined();
      expect(store.get('2')).toBeUndefined();
    });

    it('should work on empty store', () => {
      store.clear();

      expect(store.getAll()).toEqual([]);
    });
  });

  describe('count', () => {
    it('should return 0 for empty store', () => {
      expect(store.count()).toBe(0);
    });

    it('should return correct count', () => {
      store.set('1', { id: '1', name: 'First', value: 1 });
      store.set('2', { id: '2', name: 'Second', value: 2 });

      expect(store.count()).toBe(2);
    });

    it('should update after operations', () => {
      store.set('1', { id: '1', name: 'First', value: 1 });
      expect(store.count()).toBe(1);

      store.set('2', { id: '2', name: 'Second', value: 2 });
      expect(store.count()).toBe(2);

      store.delete('1');
      expect(store.count()).toBe(1);

      store.clear();
      expect(store.count()).toBe(0);
    });
  });
});
