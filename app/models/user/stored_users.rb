module User
  class StoredUsers
    include ActiveRecordHelper

    def self.get(uid)
      stored_users = {
        :saved => [],
        :recent => []
      }
      uid_entries = get_stored_uid_entries(uid)

      uid_entries[:saved].each do |entry|
        id = entry[:stored_uid]
        user = User::SearchUsersByUid.new(:id => id).search_users_by_uid[0]
        if user
          stored_users[:saved] << user
        end
      end

      uid_entries[:recent].each do |entry|
        id = entry[:stored_uid]
        user = User::SearchUsersByUid.new(:id => id).search_users_by_uid[0]
        if user
          stored_users[:recent] << user
        end
      end

      stored_users
    end


    def self.store_saved_uid

    end

    def self.store_recent_uid

    end

    private

    def self.get_stored_uid_entries(uid)
      stored_entries = {
        :saved => [],
        :recent => []
      }
      user = get_user(uid)
      if user
        stored_entries[:saved] = user.saved_uids
        stored_entries[:recent] = user.recent_uids
      end
      stored_entries
    end

    def self.get_user(uid)
      use_pooled_connection {
        User::Data.where(:uid => uid.to_s).first
      }
    end

  end
end
