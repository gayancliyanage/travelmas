<?php if (! defined ( 'BASEPATH' )) 	exit ( 'No direct script access allowed' );


class Message_lib
{
	/**
	 * CodeIgniter global
	 *
	 * @var string
	 * */
	protected $ci;
	
	public function __construct()
	{
		$this->ci = & get_instance();
		$this->ci->load->model('message/message_model');
	}
	
	public function get_person_suggestions($user_id,$text)
	{
		return $this->ci->message_model->get_person_suggestions($user_id,$text);
	}
	
	public function send($data = array())
	{
		return $this->ci->message_model->send($data);
	}
	
	public function get_previous_conversations($user_id=null,$person_id=null,$limit=null,$offset=null)
	{
		return $this->ci->message_model->get_previous_conversations($user_id,$person_id,$limit,$offset);
	}
	
	public function get_inbox_messages($user_id=null)
	{
	  	return $this->ci->message_model->get_inbox_messages($user_id);
	}
	
	public function get_sent_messages($user_id=null)
	{
		return $this->ci->message_model->get_sent_messages($user_id);
	}
	
	public function mark_as_old_conversation($user_id=null,$person_id=null)
	{
		return $this->ci->message_model->mark_as_old_conversation($user_id,$person_id);
	}
	
	/**
	 * get messages by type
	 * @param unknown $profile_id
	 * @param string $message_type
	 * @param string $offset
	 * @param string $limit
	 */
	public function get_messages($profile_id, $message_type=null,$limit=null,$offset=null)
	{
		return $this->ci->message_model->get_messages($profile_id,$message_type,$limit,$offset);
	}
	
	public function get_recent_conversation_ids($profile_id)
	{
		return $this->ci->message_model->get_recent_conversation_ids($profile_id);
	}
	
	public function get_recent_conversations($profile_id)
	{
		$id_list = $this->get_recent_conversation_ids($profile_id);		
		$id_set = array();
		$result = array();
		if(count($id_list)>0){
		foreach($id_list as $id)
		{
			array_push($id_set, $id['ID']);
		}
		$result = $this->ci->message_model->get_conversations_by_ids($id_set);
		}
		return $result;
	}
	
	public function get_message_details($id_set)
	{
		$result = $this->ci->message_model->get_conversations_by_ids($id_set);
		return $result;
	}
	
	public function delete_message($msg_id,$data)
	{
		return $this->ci->message_model->delete_message($msg_id,$data);
	}
	
}
	