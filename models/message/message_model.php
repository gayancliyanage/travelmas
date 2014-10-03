<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Message_model extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->config( 'masterdb_config', TRUE );
		$this->mastables = $this->config->item('masterdb_config');
	}

	/**
	 * get user suggestions to send a message
	 * @param int $user_id
	 * @param int $text
	 * @return array
	 */
	public function get_person_suggestions($user_id,$text)
	{
		$this->db->select('b.ProfileID,b.FirstName,b.LastName');
		$this->db->from($this->mastables['bookmark'].' as a');
		$this->db->join($this->mastables['user'].' as b','a.EntityID = b.ProfileID');
		$this->db->where('a.Type',1);
		$this->db->where('a.ProfileID',$user_id);
		$this->db->like('b.FirstName',$text);
		$this->db->or_like('b.LastName',$text);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	/**
	 * add message data
	 * @param array $data
	 */
	public function send($data = array())
	{
		$result =  $this->db->insert($this->mastables['messages'],$data);
		return $this->db->insert_id();
	}

	/**
	 * get previous conversation messages between two people
	 * @param int $user_id
	 * @param int $person_id
	 * @return array
	 */
	public function get_previous_conversations($user_id=null,$person_id=null,$limit=null,$offset=null)
	{

		$this->db->select('a.*,b.ProfileID,b.FirstName,b.LastName,b.Location');
		$this->db->from($this->mastables['messages'].' as a');
		$this->db->join($this->mastables['user'].' as b','a.SenderID = b.ProfileID');
		$this->db->where('(SenderID ='.$user_id.' AND SenderDeleted = 0) AND a.RecieverID='.$person_id );
		$this->db->or_where('a.SenderID ='. $person_id . ' AND (RecieverID ='.$user_id.' && RecieverDeleted = 0)');
		$this->db->where('a.MessageType',0);
		$this->db->order_by('a.CreatedOn', 'desc');
		if($limit != null ){
			$this->db->limit($limit,$offset);
		}
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	public function get_inbox_messages($user_id=null)
	{
		$sql1 = " SELECT a.*,c.FirstName,c.LastName,c.ProfileID
		FROM (".$this->mastables['messages']." as a)
		INNER JOIN
		(
		SELECT  `SenderID`, MAX(`CreatedOn`) as CreatedOn
		FROM ".$this->mastables['messages']."
		GROUP BY `SenderID`
		) as b  ON `b`.`SenderID`=a.SenderID AND `b`.`CreatedOn` = a.`CreatedOn` AND a.`MessageType`=0 AND a.`SenderID`!=".$user_id." AND a.RecieverID = ".$user_id."
		JOIN ".$this->mastables['user']." as c ON a.SenderID = c.ProfileID";

		$query = $this->db->query($sql1);
		$result = $query->result_array();
		return array_reverse($result);
	}

	public function get_sent_messages($user_id=null)
	{
		$this->db->select('a.*,b.ProfileID,b.FirstName,b.LastName');
		$this->db->from($this->mastables['messages'].' as a');
		$this->db->join($this->mastables['user'].' as b',' a.RecieverID = b.ProfileID');
		$this->db->where('a.SenderID',$user_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	public function mark_as_old_conversation($user_id=null,$person_id=null)
	{
		$data = array('IsRead'=>1);
		$this->db->where('RecieverID ='.$user_id.' And SenderID = '.$person_id);

		return $this->db->update($this->mastables['messages'],$data);
	}

	/**
	 * get all message details by profile id
	 * @param unknown_type $profile_id
	 * @param unknown_type $message_type
	 */
	public function get_messages($profile_id, $message_type,$limit=null,$offset=null){
		$this->db->select('*');
		$this->db->from($this->mastables['messages']);
		$this->db->where('(SenderID ='.$profile_id.' && SenderDeleted = 0)');
		$this->db->or_where('(RecieverID ='.$profile_id.' && RecieverDeleted = 0)');
		$this->db->where('MessageType',$message_type);
		$this->db->order_by('ID', 'desc');
		if($limit != null)
		{
			$this->db->limit($limit,$offset);
		}
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	public function get_recent_conversation_ids($profile_id)
	{
		$sql = "select c.ID from (select
		ID,
		case when SenderID < RecieverID then SenderID else RecieverID end as a,
		case when SenderID < RecieverID then RecieverID  else SenderID end as b
		from mas_messages where (SenderID =".$profile_id." && SenderDeleted = 0) or (RecieverID =".$profile_id." && RecieverDeleted = 0) order by ID desc ) as c
		group by c.a,c.b";
		$query = $this->db->query($sql);
		$result = $query->result_array();
		return array_reverse($result);
	}

	public function get_conversations_by_ids($id_set)
	{
		$this->db->select('a.*,b.FirstName as SenderFirstName,b.LastName as SenderLastName,b.ProfilePicture as SenderPicture,c.FirstName as RecieverFirstName,c.LastName as RecieverLastName, c.ProfilePicture as RecieverPicture');
		$this->db->from($this->mastables['messages'].' as a');
		$this->db->join($this->mastables['user'].' as b',' a.SenderID = b.ProfileID');
		$this->db->join($this->mastables['user'].' as c',' a.RecieverID = c.ProfileID');
		$this->db->where_in('ID',$id_set);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}

	public function delete_message($msg_id,$data)
	{
		$this->db->where('ID',$msg_id);
		return $this->db->update($this->mastables['messages'],$data);
	}
}