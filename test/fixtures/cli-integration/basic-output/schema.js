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
  "fieldBaseTypes": {
    "id": "ID"
  },
  "possibleTypes": ["Product"]
};

const Shop = {
  "name": "Shop",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String",
    "address": "String"
  },
  "implementsNode": false
};

const String = {
  "name": "String",
  "kind": "SCALAR"
};

const __Schema = {
  "name": "__Schema",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "types": "__Type",
    "queryType": "__Type",
    "mutationType": "__Type",
    "subscriptionType": "__Type",
    "directives": "__Directive"
  },
  "implementsNode": false
};

const __Type = {
  "name": "__Type",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "kind": "__TypeKind",
    "name": "String",
    "description": "String",
    "fields": "__Field",
    "interfaces": "__Type",
    "possibleTypes": "__Type",
    "enumValues": "__EnumValue",
    "inputFields": "__InputValue",
    "ofType": "__Type"
  },
  "implementsNode": false
};

const __TypeKind = {
  "name": "__TypeKind",
  "kind": "ENUM"
};

const Boolean = {
  "name": "Boolean",
  "kind": "SCALAR"
};

const __Field = {
  "name": "__Field",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String",
    "description": "String",
    "args": "__InputValue",
    "type": "__Type",
    "isDeprecated": "Boolean",
    "deprecationReason": "String"
  },
  "implementsNode": false
};

const __InputValue = {
  "name": "__InputValue",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String",
    "description": "String",
    "type": "__Type",
    "defaultValue": "String"
  },
  "implementsNode": false
};

const __EnumValue = {
  "name": "__EnumValue",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String",
    "description": "String",
    "isDeprecated": "Boolean",
    "deprecationReason": "String"
  },
  "implementsNode": false
};

const __Directive = {
  "name": "__Directive",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String",
    "description": "String",
    "locations": "__DirectiveLocation",
    "args": "__InputValue",
    "onOperation": "Boolean",
    "onFragment": "Boolean",
    "onField": "Boolean"
  },
  "implementsNode": false
};

const __DirectiveLocation = {
  "name": "__DirectiveLocation",
  "kind": "ENUM"
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

const Collection = {
  "name": "Collection",
  "kind": "OBJECT",
  "fieldBaseTypes": {
    "name": "String",
    "products": "Product"
  },
  "implementsNode": false
};

const Types = {
  types: {}
};
Types.types["Query"] = Query;
Types.types["ID"] = ID;
Types.types["Node"] = Node;
Types.types["Shop"] = Shop;
Types.types["String"] = String;
Types.types["__Schema"] = __Schema;
Types.types["__Type"] = __Type;
Types.types["__TypeKind"] = __TypeKind;
Types.types["Boolean"] = Boolean;
Types.types["__Field"] = __Field;
Types.types["__InputValue"] = __InputValue;
Types.types["__EnumValue"] = __EnumValue;
Types.types["__Directive"] = __Directive;
Types.types["__DirectiveLocation"] = __DirectiveLocation;
Types.types["Product"] = Product;
Types.types["Float"] = Float;
Types.types["Collection"] = Collection;
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
