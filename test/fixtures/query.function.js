function query(client) {
  const document = client.document();
  const spreads = {};
  spreads.ProductFragment = document.defineFragment("ProductFragment", "Product", root => {
    root.add("id");
    root.add("name");
    root.add("price");
  });
  document.addQuery("FancyQuery", [client.variable("id", "ID!")], root => {
    root.add("node", {
      args: {
        id: client.variable("id")
      }
    }, node => {
      node.addFragment(spreads.ProductFragment);
    });
  });
  return document;
}
