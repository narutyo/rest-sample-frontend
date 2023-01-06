const FETCH_FIELDS = {
  noteTemplateList: [
    'uuid',
    'name',
    'template_id',
    'folder_uri',
    'recordset_model',
    'recordset_page_template_id',
    'recordset_tagname_space',
    'created_at',
    'note_template_tag_params'
  ],
  noteAlignmentList: [
    'uuid',
    'name',
    'note_template_master',
    'note_uri',
    'created_at'
  ],
  userList: [
    'uuid',
    'name',
    'identification_code',
    'admin_flg',
    'created_at'
  ]
}

export default (context, inject) => {
  inject('fetchFields', FETCH_FIELDS)
}
