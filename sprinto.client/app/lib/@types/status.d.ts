interface StatusEntity {
  id: string;
  title: string;
}

interface Status extends StatusEntity {
  createdBy: Creation;
}
