const FETCH_FIELDS = {
  noteTemplateList: [
    'uuid',
    'name',
    'template_id',
    'folder_uri',
    'created_at'
  ]
}

export default (context, inject) => {
  inject('fetchFields', FETCH_FIELDS)
}
