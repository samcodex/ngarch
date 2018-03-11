
export interface Serializable {
  $clazz: string;

}

export interface Deserializable {
  $clazz: string;
  fromJson(data: object);
}
