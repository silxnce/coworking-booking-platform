import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  //   @ApiProperty({
  //     name: 'name',
  //     required: true,
  //     description: "User's name",
  //     type: String,
  //   })
  name: string;

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
  @MinLength(8, {
    message:
      'Password is too short. Minimum length is $constraint1 characters.',
  })
  @MaxLength(20, {
    message: 'Password is too long. Maximum length is $constraint1 characters.',
  })
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/, {
    message: 'Password must contain letters and numbers.',
  })
  //   @ApiProperty({
  //     name: 'password',
  //     required: true,
  //     description: "User's password",
  //     type: String,
  //   })
  password: string;
}
