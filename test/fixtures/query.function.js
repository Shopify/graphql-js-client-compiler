function query(client) {
  const document = client.document();
  const spreads = {};
  const variables = {};
  variables.FancyQuery = {};
  variables.FancyQuery.id = client.variable("id", "ID!");
  spreads.ProductFragment = document.defineFragment("ProductFragment", "Product", root => {
    root.add("id");
    root.add("name");
    root.add("price");
  });
  document.addQuery("FancyQuery", [variables.FancyQuery.id], root => {
    root.add("node", {
      args: {
        id: variables.FancyQuery.id
      }
    }, node => {
      node.addFragment(spreads.ProductFragment);
    });
  });
  return document;
}
