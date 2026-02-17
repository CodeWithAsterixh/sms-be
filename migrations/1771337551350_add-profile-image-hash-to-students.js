exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumn('students', {
        profile_image_hash: {
            type: 'text',
            notNull: false,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('students', 'profile_image_hash');
};
