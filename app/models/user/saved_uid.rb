module User
  class SavedUid < ActiveRecord::Base
    include ActiveRecordHelper
    after_initialize :log_access, :log_threads

    self.table_name = 'saved_uids'

    belongs_to :data, :class_name => 'User::Data', :foreign_key => 'owner_uid'

    attr_accessible :stored_uid

  end
end
