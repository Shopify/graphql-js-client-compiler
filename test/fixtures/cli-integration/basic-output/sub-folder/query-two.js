export default function query(client) {
  const document = client.document();
  document.addQuery(root => {
    root.add("shop", shop => {
      shop.add("name");
    });
  });
  return document;
}
