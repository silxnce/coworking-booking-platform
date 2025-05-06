import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  //   @ApiProperty({
  //     name: 'email',
  //     required: true,
  //     description: "User's email",
  //     type: String,
  //   })
  email: string;

  @IsString()
  @IsNotEmpty()
  //   @ApiProperty({
  //     name: 'password',
  //     required: true,
  //     description: "User's password",
  //     type: String,
  //   })
  password: string;
}
