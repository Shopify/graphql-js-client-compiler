const Query = {
  "name": "Query",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "node": "Node",
    "shop": "Shop"
  },
  "implementsNode": false
};

const ID = {
  "name": "ID",
  "kind": "SCALAR"
};

const Node = {
  "name": "Node",
  "kind": "INTERFACE",
  "fieldBaseTypes": {},
  "possibleTypes": ["Product"]
};

const Shop = {
  "name": "Shop",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String"
  },
  "implementsNode": false
};

const String = {
  "name": "String",
  "kind": "SCALAR"
};

const Product = {
  "name": "Product",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "id": "ID",
    "name": "String",
    "price": "Float"
  },
  "implementsNode": true
};

const Float = {
  "name": "Float",
  "kind": "SCALAR"
};

const Types = {
  types: {}
};
Types.types["Query"] = Query;
Types.types["ID"] = ID;
Types.types["Node"] = Node;
Types.types["Shop"] = Shop;
Types.types["String"] = String;
Types.types["Product"] = Product;
Types.types["Float"] = Float;
Types.queryType = "Query";
Types.mutationType = null;
Types.subscriptionType = null;

function recursivelyFreezeObject(structure) {
  Object.getOwnPropertyNames(structure).forEach(key => {
    const value = structure[key];
    if (value && typeof value === 'object') {
      recursivelyFreezeObject(value);
    }
  });
  Object.freeze(structure);
  return structure;
}

var types = recursivelyFreezeObject(Types);

export default types;
