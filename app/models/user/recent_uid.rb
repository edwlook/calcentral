module User
  class RecentUid < ActiveRecord::Base
    include ActiveRecordHelper
    after_initialize :log_access, :log_threads

    self.table_name = 'recent_uids'

    belongs_to :data, :class_name => 'User::Data', :foreign_key => 'owner_uid'

    attr_accessible :stored_uid

  end
end
