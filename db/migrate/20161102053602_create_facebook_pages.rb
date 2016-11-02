class CreateFacebookPages < ActiveRecord::Migration[5.0]
  def change
		create_table :user_facebook_pages do |t|
			t.string :page_id
			t.string :access_token
			t.string :graph_payload
			t.references :user, foreign_key: true
			t.timestamps
		end
    add_index :user_facebook_pages, [:user_id, :page_id], unique: true
  end
end
