require 'json'

class MyPlaylists < MyMergedModel

  def initialize(options={})
    # @base_url = options[:base_url] ||= 'http://localhost:3000/dummy/json/videos.json'
    @base_url = options[:base_url] ||= 'http://webcast.berkeley.edu/itunesu_podcasts.js'
    @playlist_title = options[:playlist_title] ? options[:playlist_title] : false
    @fetch_error_message = 'There was a problem fetching the videos.'
    @no_videos_error_message = 'There are no videos.'
    @my_playlist = {
      :error_message => '',
      :playlist_id => ''
    }
  end

  def get_playlists_as_json
    response = request
    if response.blank?
      @my_playlist[:error_message] = @fetch_error_message
      return @my_playlist
    end
    data = convert_to_json(response)
    if !data
      @my_playlist[:error_message] = @fetch_error_message
      return @my_playlist
    end
    # If no playlist title is supplied, return full list of playlists
    if !@playlist_title
      return data
    end
    get_playlist_id(data, @playlist_title)
    @my_playlist
  end

  def request
    proxy = VideosProxy.new({:url => @base_url, :vcr_name => 'Playlists'})
    proxy_response = proxy.get
  end

  def convert_to_json(response)
    data = response[:body]
    cut_index = data.index('itu_courses')
    # Extract the itu_courses array
    js = data.slice(cut_index..-1)
    # Format to valid JSON
    replacements =
    [
      [' =', ':'],
      ['itu_courses', '"itu_courses"'],
      [';', ''],
      ['//', ''],
      [/\t/, '']
    ]
    replacements.each {|replacement| js.gsub!(replacement[0], replacement[1])}
    # Strip trailing commas if they exist
    if js.rindex(',') == js.rindex('}') + 1
      js.slice!(js.rindex(','))
    end
    json = '{' + js + '}'
    result = JSON.parse(json)
  rescue => e
    puts "There was an issue parsing the data: #{e.message}"
    return false
  end

  def get_playlist_id(data, title)
    courses = data['itu_courses']
    courses.each do |course|
      # Make sure the titles match and the playlist_id exists
      if course['title'].downcase == title.downcase && !course['youTube'].blank?
        @my_playlist[:playlist_id] = course['youTube']
        return
      end
    end
    @my_playlist[:error_message] = @no_videos_error_message
  end

end
