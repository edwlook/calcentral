require 'open-uri'
require 'json'

class MyPlaylists < MyMergedModel

  def initialize(options={})
    @base_url = options[:base_url] ||= 'http://webcast.berkeley.edu/itunesu_podcasts.js'
    # @base_url = options[:base_url] ||= 'http://localhost:3000/json/videos_dummy.json'
    @playlist_title = options[:playlist_title] ? options[:playlist_title] : false
  end

  def get_playlists_as_json
    response = request(@base_url)
    if !response
      return 'error'
    end
    data = convert_to_json(response)
    if !data
      return 'error'
    end
    # If no playlist title is supplied, return full list of playlists
    if !@playlist_title
      return data
    end
    playlist_id = get_playlist_id(data, @playlist_title)
  end

  def request(url)
    begin
      response = open(url)
    rescue => e
      puts "An error occured while requesting #{url}"
      puts e
      return false
    end
    return response
  end

  def convert_to_json(response)
    data = response.read
    # extract the itu_courses array
    cut_index = data.index('itu_courses')
    js = data.slice(cut_index..-1)
    replacements =
    [
      [' =', ':'],
      ['var ', ''],
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
      if course['title'].downcase == title.downcase && !course['youTube'].blank?
        return course['youTube']
      end
    end
    return false
  end

end
